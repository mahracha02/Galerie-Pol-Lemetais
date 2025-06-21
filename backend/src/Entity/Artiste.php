<?php

namespace App\Entity;

use App\Repository\ArtisteRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity(repositoryClass: ArtisteRepository::class)]
#[ApiResource] 
class Artiste
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $bio = null;

    #[ORM\Column(length: 255)]
    private ?string $photo = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateNaissance = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $dateDeces = null;

    #[ORM\Column(length: 255)]
    private ?string $pays = null;

    /**
     * @var Collection<int, Evenement>
     */
    #[ORM\ManyToMany(targetEntity: Evenement::class, mappedBy: 'artists')]
    private Collection $events;

    /**
     * @var Collection<int, Exposition>
     */
    #[ORM\ManyToMany(targetEntity: Exposition::class, mappedBy: 'artists')]
    private Collection $expositions;

    /**
     * @var Collection<int, Evenement>
     */
    #[ORM\OneToMany(targetEntity: Evenement::class, mappedBy: 'artistePrincipal')]
    private Collection $evenements;

    /**
     * @var Collection<int, Exposition>
     */
    #[ORM\OneToMany(targetEntity: Exposition::class, mappedBy: 'artistePrincipal')]
    private Collection $expos;

    /**
     * @var Collection<int, Exposition>
     */
    #[ORM\OneToMany(targetEntity: Exposition::class, mappedBy: 'artistePrincipal')]
    private Collection $expo;

    /**
     * @var Collection<int, Oeuvre>
     */
    #[ORM\OneToMany(targetEntity: Oeuvre::class, mappedBy: 'artiste')]
    private Collection $oeuvres;

    /**
     * @var Collection<int, Oeuvre>
     */
    #[ORM\OneToMany(targetEntity: Oeuvre::class, mappedBy: 'artiste')]
    private Collection $lesOeuvres;

    /**
     * @var Collection<int, Medias>
     */
    #[ORM\OneToMany(targetEntity: Medias::class, mappedBy: 'artiste')]
    private Collection $medias;

    public function __construct()
    {
        $this->events = new ArrayCollection();
        $this->expositions = new ArrayCollection();
        $this->evenements = new ArrayCollection();
        $this->expos = new ArrayCollection();
        $this->expo = new ArrayCollection();
        $this->oeuvres = new ArrayCollection();
        $this->lesOeuvres = new ArrayCollection();
        $this->medias = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getBio(): ?string
    {
        return $this->bio;
    }

    public function setBio(string $bio): static
    {
        $this->bio = $bio;

        return $this;
    }

    public function getPhoto(): ?string
    {
        return $this->photo;
    }

    public function setPhoto(string $photo): static
    {
        $this->photo = $photo;

        return $this;
    }

    public function getDateNaissance(): ?\DateTimeInterface
    {
        return $this->dateNaissance;
    }

    public function setDateNaissance(\DateTimeInterface $dateNaissance): static
    {
        $this->dateNaissance = $dateNaissance;

        return $this;
    }

    public function getDateDeces(): ?\DateTimeInterface
    {
        return $this->dateDeces;
    }

    public function setDateDeces(?\DateTimeInterface $dateDeces): static
    {
        $this->dateDeces = $dateDeces;

        return $this;
    }

    public function getPays(): ?string
    {
        return $this->pays;
    }

    public function setPays(string $pays): static
    {
        $this->pays = $pays;

        return $this;
    }

    /**
     * @return Collection<int, Evenement>
     */
    public function getEvents(): Collection
    {
        return $this->events;
    }

    public function addEvent(Evenement $event): static
    {
        if (!$this->events->contains($event)) {
            $this->events->add($event);
            $event->addArtist($this);
        }

        return $this;
    }

    public function removeEvent(Evenement $event): static
    {
        if ($this->events->removeElement($event)) {
            $event->removeArtist($this);
        }

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
            $exposition->addArtist($this);
        }

        return $this;
    }

    public function removeExposition(Exposition $exposition): static
    {
        if ($this->expositions->removeElement($exposition)) {
            $exposition->removeArtist($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, Evenement>
     */
    public function getEvenements(): Collection
    {
        return $this->evenements;
    }

    public function addEvenement(Evenement $evenement): static
    {
        if (!$this->evenements->contains($evenement)) {
            $this->evenements->add($evenement);
            $evenement->setArtistePrincipal($this);
        }

        return $this;
    }

    public function removeEvenement(Evenement $evenement): static
    {
        if ($this->evenements->removeElement($evenement)) {
            // set the owning side to null (unless already changed)
            if ($evenement->getArtistePrincipal() === $this) {
                $evenement->setArtistePrincipal(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Exposition>
     */
    public function getExpos(): Collection
    {
        return $this->expos;
    }

    public function addExpo(Exposition $expo): static
    {
        if (!$this->expos->contains($expo)) {
            $this->expos->add($expo);
            $expo->setArtistePrincipal($this);
        }

        return $this;
    }

    public function removeExpo(Exposition $expo): static
    {
        if ($this->expos->removeElement($expo)) {
            // set the owning side to null (unless already changed)
            if ($expo->getArtistePrincipal() === $this) {
                $expo->setArtistePrincipal(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Exposition>
     */
    public function getExpo(): Collection
    {
        return $this->expo;
    }

    /**
     * @return Collection<int, Oeuvre>
     */
    public function getOeuvres(): Collection
    {
        return $this->oeuvres;
    }

    public function addOeuvre(Oeuvre $oeuvre): static
    {
        if (!$this->oeuvres->contains($oeuvre)) {
            $this->oeuvres->add($oeuvre);
            $oeuvre->setArtiste($this);
        }

        return $this;
    }

    public function removeOeuvre(Oeuvre $oeuvre): static
    {
        if ($this->oeuvres->removeElement($oeuvre)) {
            // set the owning side to null (unless already changed)
            if ($oeuvre->getArtiste() === $this) {
                $oeuvre->setArtiste(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Oeuvre>
     */
    public function getLesOeuvres(): Collection
    {
        return $this->lesOeuvres;
    }

    public function addLesOeuvre(Oeuvre $lesOeuvre): static
    {
        if (!$this->lesOeuvres->contains($lesOeuvre)) {
            $this->lesOeuvres->add($lesOeuvre);
            $lesOeuvre->setArtiste($this);
        }

        return $this;
    }

    public function removeLesOeuvre(Oeuvre $lesOeuvre): static
    {
        if ($this->lesOeuvres->removeElement($lesOeuvre)) {
            // set the owning side to null (unless already changed)
            if ($lesOeuvre->getArtiste() === $this) {
                $lesOeuvre->setArtiste(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Medias>
     */
    public function getMedias(): Collection
    {
        return $this->medias;
    }

    public function addMedia(Medias $media): static
    {
        if (!$this->medias->contains($media)) {
            $this->medias->add($media);
            $media->setArtiste($this);
        }

        return $this;
    }

    public function removeMedia(Medias $media): static
    {
        if ($this->medias->removeElement($media)) {
            // set the owning side to null (unless already changed)
            if ($media->getArtiste() === $this) {
                $media->setArtiste(null);
            }
        }

        return $this;
    }

    
}
