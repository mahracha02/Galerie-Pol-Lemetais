<?php

namespace App\Form;

use App\Entity\Actualites;
use App\Entity\evenement;
use App\Entity\exposition;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ActualitesType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('titre')
            ->add('date', null, [
                'widget' => 'single_text'
            ])
            ->add('description')
            ->add('image')
            ->add('link')
            ->add('nouveau')
            ->add('exposition', EntityType::class, [
                'class' => exposition::class,
'choice_label' => 'id',
            ])
            ->add('evenement', EntityType::class, [
                'class' => evenement::class,
'choice_label' => 'id',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Actualites::class,
        ]);
    }
}
