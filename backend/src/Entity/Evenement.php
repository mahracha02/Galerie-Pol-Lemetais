<?php

namespace App\Entity;

use App\Repository\EvenementRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EvenementRepository::class)]
class Evenement
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $titre = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $date_debut = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $date_fin = null;

    #[ORM\Column(length: 255)]
    private ?string $lieu = null;

    #[ORM\Column(length: 255)]
    private ?string $image = null;

    #[ORM\Column(length: 255)]
    private ?string $site_url = null;

    /**
     * @var Collection<int, artiste>
     */
    #[ORM\ManyToMany(targetEntity: artiste::class, inversedBy: 'events')]
    private Collection $artists;

    #[ORM\ManyToOne(inversedBy: 'evenements')]
    private ?artiste $artistePrincipal = null;

    /**
     * @var Collection<int, Actualites>
     */
    #[ORM\OneToMany(targetEntity: Actualites::class, mappedBy: 'evenement')]
    private Collection $actualites;

    #[ORM\Column]
    private ?bool $published = null;

    /**
     * @var Collection<int, Medias>
     */
    #[ORM\OneToMany(targetEntity: Medias::class, mappedBy: 'evenement')]
    private Collection $medias;

    /**
     * @var Collection<int, Oeuvre>
     */
    #[ORM\ManyToMany(targetEntity: Oeuvre::class, mappedBy: 'evenement')]
    private Collection $oeuvres;

    public function __construct()
    {
        $this->artists = new ArrayCollection();
        $this->actualites = new ArrayCollection();
        $this->medias = new ArrayCollection();
        $this->oeuvres = new ArrayCollection();
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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getDateDebut(): ?\DateTimeInterface
    {
        return $this->date_debut;
    }

    public function setDateDebut(\DateTimeInterface $date_debut): static
    {
        $this->date_debut = $date_debut;

        return $this;
    }

    public function getDateFin(): ?\DateTimeInterface
    {
        return $this->date_fin;
    }

    public function setDateFin(\DateTimeInterface $date_fin): static
    {
        $this->date_fin = $date_fin;

        return $this;
    }

    public function getLieu(): ?string
    {
        return $this->lieu;
    }

    public function setLieu(string $lieu): static
    {
        $this->lieu = $lieu;

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

    public function getSiteUrl(): ?string
    {
        return $this->site_url;
    }

    public function setSiteUrl(string $site_url): static
    {
        $this->site_url = $site_url;

        return $this;
    }

    /**
     * @return Collection<int, artiste>
     */
    public function getArtists(): Collection
    {
        return $this->artists;
    }

    public function addArtist(artiste $artist): static
    {
        if (!$this->artists->contains($artist)) {
            $this->artists->add($artist);
        }

        return $this;
    }

    public function removeArtist(artiste $artist): static
    {
        $this->artists->removeElement($artist);

        return $this;
    }

    public function getArtistePrincipal(): ?artiste
    {
        return $this->artistePrincipal;
    }

    public function setArtistePrincipal(?artiste $artistePrincipal): static
    {
        $this->artistePrincipal = $artistePrincipal;

        return $this;
    }

    /**
     * @return Collection<int, Actualites>
     */
    public function getActualites(): Collection
    {
        return $this->actualites;
    }

    public function addActualite(Actualites $actualite): static
    {
        if (!$this->actualites->contains($actualite)) {
            $this->actualites->add($actualite);
            $actualite->setEvenement($this);
        }

        return $this;
    }

    public function removeActualite(Actualites $actualite): static
    {
        if ($this->actualites->removeElement($actualite)) {
            // set the owning side to null (unless already changed)
            if ($actualite->getEvenement() === $this) {
                $actualite->setEvenement(null);
            }
        }

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
            $media->setEvenement($this);
        }

        return $this;
    }

    public function removeMedia(Medias $media): static
    {
        if ($this->medias->removeElement($media)) {
            // set the owning side to null (unless already changed)
            if ($media->getEvenement() === $this) {
                $media->setEvenement(null);
            }
        }

        return $this;
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
            $oeuvre->addEvenement($this);
        }

        return $this;
    }

    public function removeOeuvre(Oeuvre $oeuvre): static
    {
        if ($this->oeuvres->removeElement($oeuvre)) {
            $oeuvre->removeEvenement($this);
        }

        return $this;
    }

    
}
