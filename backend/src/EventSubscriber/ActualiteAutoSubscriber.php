<?php

namespace App\EventSubscriber;

use App\Entity\Actualites as Actualite;
use App\Entity\Exposition;
use App\Entity\Evenement;
use Doctrine\Common\EventSubscriber;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Doctrine\ORM\Events;

class ActualiteAutoSubscriber implements EventSubscriber
{
    public function getSubscribedEvents(): array
    {
        return [Events::postPersist];
    }

    public function postPersist(LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();
        $em = $args->getObjectManager();

        $actualite = new Actualite();
        $actualite->setDate(new \DateTimeImmutable());
        
        // Vérifier si l'actualité a été créée dans les 2 dernières semaines
        $twoWeeksAgo = new \DateTimeImmutable('-2 weeks');
        if ($actualite->getDate() >= $twoWeeksAgo) {
            $actualite->setNouveau(true);  // "Nouveau" pendant 2 semaines
        } else {
            $actualite->setNouveau(false); // Après 2 semaines, "Nouveau" est désactivé
        }

        if ($entity instanceof Exposition) {
            $actualite->setTitre('Nouvelle exposition : ' . $entity->getTitre());
            $actualite->setDescription($entity->getDescription());
            $actualite->setImage($entity->getImage());
            $actualite->setLink('/expositions/' . $entity->getId());
            $actualite->setExposition($entity);
        }

        if ($entity instanceof Evenement) {
            $actualite->setTitre('Nouvel événement : ' . $entity->getTitre());
            $actualite->setDescription($entity->getDescription());
            $actualite->setImage($entity->getImage());
            $actualite->setLink('/evenements/' . $entity->getId());
            $actualite->setEvenement($entity);
        }

        if ($actualite->getTitre()) {
            $em->persist($actualite);
            $em->flush();
        }
    }
}
