<?php

$entityDir = __DIR__ . '/src/Entity';
$entityFiles = glob($entityDir . '/*.php');

$declaredEntities = [];

foreach ($entityFiles as $file) {
    $content = file_get_contents($file);
    if (preg_match('/namespace\s+App\\\\Entity;/', $content)) {
        if (preg_match('/class\s+(\w+)/', $content, $matches)) {
            $declaredEntities[] = $matches[1];
        }
    }
}

echo "✅ Entités détectées :\n";
print_r($declaredEntities);

echo "\n🔍 Recherche des mauvaises casses...\n\n";

foreach ($entityFiles as $file) {
    $content = file_get_contents($file);
    foreach ($declaredEntities as $entity) {
        // Cherche toute utilisation d’un nom mal écrit (minuscule / mauvaise casse)
        $wrongCased = strtolower($entity);
        if (
            preg_match_all('/targetEntity\s*=\s*["\']App\\\\Entity\\\\' . $wrongCased . '["\']/', $content, $matches)
            || preg_match_all('/' . $wrongCased . '::class/', $content, $matches2)
        ) {
            echo "❌ Mauvaise casse trouvée dans : " . basename($file) . "\n";
            echo "   Mauvais usage de `{$wrongCased}` au lieu de `{$entity}`\n\n";
        }
    }
}

echo "✅ Pas de mauvaises casses trouvées !\n";