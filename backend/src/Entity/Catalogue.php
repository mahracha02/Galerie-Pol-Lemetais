<?php

namespace App\Entity;

use App\Repository\CatalogueRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CatalogueRepository::class)]
class Catalogue
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $titre = null;

    #[ORM\Column(length: 255)]
    private ?string $image = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $link = null;

    #[ORM\Column]
    private ?bool $published = null;

    /**
     * @var Collection<int, Exposition>
     */
    #[ORM\OneToMany(targetEntity: Exposition::class, mappedBy: 'catalogue')]
    private Collection $expositions;

    public function __construct()
    {
        $this->expositions = new ArrayCollection();
    }

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

    public function getLink(): ?string
    {
        return $this->link;
    }

    public function setLink(?string $link): static
    {
        $this->link = $link;

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

    /**
     * @return Collection<int, Exposition>
     */
    public function getExpositions(): Collection
    {
        return $this->expositions;
    }

    public function addExposition(Exposition $exposition): static
    {
        if (!$this->expositions->contains($exposition)) {
            $this->expositions->add($exposition);
            $exposition->setCatalogue($this);
        }

        return $this;
    }

    public function removeExposition(Exposition $exposition): static
    {
        if ($this->expositions->removeElement($exposition)) {
            // set the owning side to null (unless already changed)
            if ($exposition->getCatalogue() === $this) {
                $exposition->setCatalogue(null);
            }
        }

        return $this;
    }
}
