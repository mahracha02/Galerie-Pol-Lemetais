<?php

namespace App\Entity;

use App\Repository\MediasRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MediasRepository::class)]
class Medias
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $titre = null;

    #[ORM\Column(length: 255)]
    private ?string $image = null;

    #[ORM\Column(length: 255)]
    private ?string $link_url = null;

    #[ORM\ManyToOne(inversedBy: 'medias')]
    private ?exposition $exposition = null;

    #[ORM\ManyToOne(inversedBy: 'medias')]
    private ?evenement $evenement = null;

    #[ORM\ManyToOne(inversedBy: 'medias')]
    private ?artiste $artiste = null;

    #[ORM\Column]
    private ?bool $published = null;

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

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(string $image): static
    {
        $this->image = $image;

        return $this;
    }

    public function getLinkUrl(): ?string
    {
        return $this->link_url;
    }

    public function setLinkUrl(string $link_url): static
    {
        $this->link_url = $link_url;

        return $this;
    }

    public function getExposition(): ?exposition
    {
        return $this->exposition;
    }

    public function setExposition(?exposition $exposition): static
    {
        $this->exposition = $exposition;

        return $this;
    }

    public function getEvenement(): ?evenement
    {
        return $this->evenement;
    }

    public function setEvenement(?evenement $evenement): static
    {
        $this->evenement = $evenement;

        return $this;
    }

    public function getArtiste(): ?artiste
    {
        return $this->artiste;
    }

    public function setArtiste(?artiste $artiste): static
    {
        $this->artiste = $artiste;

        return $this;
    }

    public function isPublished(): ?bool
    {
        return $this->published;
    }

    public function setPublished(bool $published): static
    {
        $this->published = $published;

        return $this;
    }
}
