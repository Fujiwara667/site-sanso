<?php
/**
 * Formulaire de contact SANSO Concept
 * Reçoit le formulaire de /contact/ et l'envoie par e-mail (SMTP Infomaniak / kSuite).
 * Anti-spam : champ piège « website » + délai minimum de remplissage.
 * Les identifiants SMTP sont dans contact-config.php, généré automatiquement
 * lors du déploiement à partir des secrets GitHub (jamais dans le dépôt).
 */

header('Content-Type: application/json; charset=utf-8');

// Réponse JSON puis arrêt
function repondre(bool $ok, string $message = '', int $code = 200): void {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    repondre(false, 'Méthode non autorisée.', 405);
}

$config = @include __DIR__ . '/contact-config.php';
if (!is_array($config)) {
    repondre(false, 'Le formulaire n’est pas encore configuré. Écrivez-nous par e-mail.', 500);
}

// --- Anti-spam ---
// 1. Champ piège : rempli uniquement par les robots → on fait semblant que tout va bien
if (!empty($_POST['website'])) {
    repondre(true);
}
// 2. Délai : formulaire envoyé moins de 3 s après l'ouverture de la page = robot
$t = (int)($_POST['t'] ?? 0);
if ($t === 0 || time() - $t < 3) {
    repondre(false, 'Merci de patienter quelques secondes avant d’envoyer.', 400);
}

// --- Lecture et contrôle des champs ---
function champ(string $nom, int $max): string {
    $v = trim((string)($_POST[$nom] ?? ''));
    $v = str_replace(["\r", "\0"], '', $v);
    return mb_substr($v, 0, $max);
}
$nom      = champ('name', 150);
$email    = champ('email', 200);
$tel      = champ('phone', 40);
$besoin   = champ('subject', 60);
$message  = champ('message', 10000);
$consent  = !empty($_POST['consent']);

if ($nom === '' || $message === '' || mb_strlen($message) < 10 || !$consent) {
    repondre(false, 'Merci de remplir les champs obligatoires.', 400);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    repondre(false, 'L’adresse e-mail semble invalide.', 400);
}
$besoinsValides = ['Construction bois', 'Étude bois', 'Protection incendie', 'Autre demande'];
if (!in_array($besoin, $besoinsValides, true)) {
    $besoin = 'Autre demande';
}
// Pas de retour à la ligne dans les champs utilisés en en-tête (injection d'en-têtes)
$nom = str_replace("\n", ' ', $nom);

// --- Composition du message ---
$sujet = "Demande site web – $besoin – $nom";
$corps = "Nouvelle demande depuis le site sanso-concept.ch\n\n"
       . "Nom / entreprise : $nom\n"
       . "E-mail : $email\n"
       . "Téléphone : " . ($tel !== '' ? $tel : '-') . "\n"
       . "Besoin : $besoin\n\n"
       . "Message :\n$message\n";

// --- Envoi SMTP (SSL, port 465) ---
function smtp_envoyer(array $c, string $replyTo, string $sujet, string $corps): bool {
    $sock = @stream_socket_client('ssl://' . $c['smtp_host'] . ':' . ($c['smtp_port'] ?? 465), $errno, $errstr, 15);
    if (!$sock) return false;
    stream_set_timeout($sock, 15);

    // Lit une réponse SMTP (éventuellement multi-lignes) et vérifie le code attendu
    $lire = function (string $attendu) use ($sock): bool {
        $rep = '';
        while (($ligne = fgets($sock, 515)) !== false) {
            $rep .= $ligne;
            if (isset($ligne[3]) && $ligne[3] === ' ') break;
        }
        return strncmp($rep, $attendu, 3) === 0;
    };
    $cmd = function (string $ligne, string $attendu) use ($sock, $lire): bool {
        fwrite($sock, $ligne . "\r\n");
        return $lire($attendu);
    };

    $enc = fn(string $s) => '=?UTF-8?B?' . base64_encode($s) . '?=';
    $entetes = [
        'Date: ' . date('r'),
        'From: ' . $enc('Site SANSO Concept') . ' <' . $c['smtp_user'] . '>',
        'To: <' . $c['destinataire'] . '>',
        'Reply-To: <' . $replyTo . '>',
        'Subject: ' . $enc($sujet),
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
    ];
    $data = implode("\r\n", $entetes) . "\r\n\r\n" . chunk_split(base64_encode($corps));

    $ok = $lire('220')
        && $cmd('EHLO ' . ($_SERVER['SERVER_NAME'] ?? 'localhost'), '250')
        && $cmd('AUTH LOGIN', '334')
        && $cmd(base64_encode($c['smtp_user']), '334')
        && $cmd(base64_encode($c['smtp_pass']), '235')
        && $cmd('MAIL FROM:<' . $c['smtp_user'] . '>', '250')
        && $cmd('RCPT TO:<' . $c['destinataire'] . '>', '250')
        && $cmd('DATA', '354')
        && $cmd($data . "\r\n.", '250');
    fwrite($sock, "QUIT\r\n");
    fclose($sock);
    return $ok;
}

if (!smtp_envoyer($config, $email, $sujet, $corps)) {
    repondre(false, 'L’envoi a échoué. Écrivez-nous directement à ' . $config['destinataire'] . '.', 500);
}
repondre(true);
