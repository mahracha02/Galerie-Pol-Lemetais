<?php

namespace App\Entity;

use App\Repository\OeuvreRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OeuvreRepository::class)]
class Oeuvre
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $titre = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    

    #[ORM\ManyToOne]
    private ?Exposition $exposition_id = null;

    #[ORM\ManyToOne]
    private ?Evenement $evenement_id = null;

    #[ORM\Column(length: 255)]
    private ?string $image_principale = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $images_secondaires = null;

    #[ORM\Column(length: 255)]
    private ?string $dimensions = null;

    #[ORM\Column]
    private ?int $annee = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $technique = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $remarque = null;

    #[ORM\ManyToOne(inversedBy: 'lesOeuvres')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Artiste $artiste = null;

    #[ORM\Column]
    private ?int $stock = null;

    #[ORM\Column]
    private ?float $prix = null;

    

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitre(): ?string
    {
        return $this->titre;
    }

    public function setTitre(string $titre): static
    {
        $this->titre = $titre;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    

    public function getExpositionId(): ?Exposition
    {
        return $this->exposition_id;
    }

    public function setExpositionId(?Exposition $exposition_id): static
    {
        $this->exposition_id = $exposition_id;

        return $this;
    }

    public function getEvenementId(): ?Evenement
    {
        return $this->evenement_id;
    }

    public function setEvenementId(?Evenement $evenement_id): static
    {
        $this->evenement_id = $evenement_id;

        return $this;
    }

    public function getImagePrincipale(): ?string
    {
        return $this->image_principale;
    }

    public function setImagePrincipale(string $image_principale): static
    {
        $this->image_principale = $image_principale;

        return $this;
    }

    public function getImagesSecondaires(): ?string
    {
        return $this->images_secondaires;
    }

    public function setImagesSecondaires(?string $images_secondaires): static
    {
        $this->images_secondaires = $images_secondaires;

        return $this;
    }

    public function getDimensions(): ?string
    {
        return $this->dimensions;
    }

    public function setDimensions(string $dimensions): static
    {
        $this->dimensions = $dimensions;

        return $this;
    }

    public function getAnnee(): ?int
    {
        return $this->annee;
    }

    public function setAnnee(int $annee): static
    {
        $this->annee = $annee;

        return $this;
    }

    public function getTechnique(): ?string
    {
        return $this->technique;
    }

    public function setTechnique(string $technique): static
    {
        $this->technique = $technique;

        return $this;
    }

    public function getRemarque(): ?string
    {
        return $this->remarque;
    }

    public function setRemarque(string $remarque): static
    {
        $this->remarque = $remarque;

        return $this;
    }

    public function getArtiste(): ?Artiste
    {
        return $this->artiste;
    }

    public function setArtiste(?Artiste $artiste): static
    {
        $this->artiste = $artiste;

        return $this;
    }

    public function getStock(): ?int
    {
        return $this->stock;
    }

    public function setStock(int $stock): static
    {
        $this->stock = $stock;

        return $this;
    }

    public function getPrix(): ?float
    {
        return $this->prix;
    }

    public function setPrix(float $prix): static
    {
        $this->prix = $prix;

        return $this;
    }

    
}
