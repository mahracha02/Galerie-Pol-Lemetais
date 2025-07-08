<?php

namespace App\Entity;

use App\Repository\ExpositionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use App\Entity\Catalogue;


#[ORM\Entity(repositoryClass: ExpositionRepository::class)]
#[ApiResource] 
class Exposition
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $titre = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\Column]
    private ?int $annee = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateDebut = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateFin = null;

    #[ORM\Column(length: 255)]
    private ?string $image = null;

    /**
     * @var Collection<int, Artiste>
     */
    #[ORM\ManyToMany(targetEntity: Artiste::class, inversedBy: 'expositions')]
    private Collection $artists;

    #[ORM\ManyToOne(inversedBy: 'expo')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Artiste $artistePrincipal = null;

    /**
     * @var Collection<int, Actualites>
     */
    #[ORM\OneToMany(targetEntity: Actualites::class, mappedBy: 'exposition')]
    private Collection $actualites;

    #[ORM\Column]
    private ?bool $published = null;

    #[ORM\ManyToOne(targetEntity: Catalogue::class, inversedBy: 'expositions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Catalogue $catalogue = null;

    /**
     * @var Collection<int, Medias>
     */
    #[ORM\OneToMany(targetEntity: Medias::class, mappedBy: 'exposition')]
    private Collection $medias;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $visite_virtuelle_url = null;

    /**
     * @var Collection<int, Oeuvre>
     */
    #[ORM\OneToMany(targetEntity: Oeuvre::class, mappedBy: 'exposition')]
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

    public function getAnnee(): ?int
    {
        return $this->annee;
    }

    public function setAnnee(int $annee): static
    {
        $this->annee = $annee;

        return $this;
    }

    public function getDateDebut(): ?\DateTimeInterface
    {
        return $this->dateDebut;
    }

    public function setDateDebut(\DateTimeInterface $dateDebut): static
    {
        $this->dateDebut = $dateDebut;

        return $this;
    }

    public function getDateFin(): ?\DateTimeInterface
    {
        return $this->dateFin;
    }

    public function setDateFin(\DateTimeInterface $dateFin): static
    {
        $this->dateFin = $dateFin;

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

    /**
     * @return Collection<int, Artiste>
     */
    public function getArtists(): Collection
    {
        return $this->artists;
    }

    public function addArtist(Artiste $artist): static
    {
        if (!$this->artists->contains($artist)) {
            $this->artists->add($artist);
        }

        return $this;
    }

    public function removeArtist(Artiste $artist): static
    {
        $this->artists->removeElement($artist);

        return $this;
    }

    public function getArtistePrincipal(): ?Artiste
    {
        return $this->artistePrincipal;
    }

    public function setArtistePrincipal(?Artiste $artistePrincipal): static
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
            $actualite->setExposition($this);
        }

        return $this;
    }

    public function removeActualite(Actualites $actualite): static
    {
        if ($this->actualites->removeElement($actualite)) {
            // set the owning side to null (unless already changed)
            if ($actualite->getExposition() === $this) {
                $actualite->setExposition(null);
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

    public function getCatalogue(): ?Catalogue
    {
        return $this->catalogue;
    }

    public function setCatalogue(?Catalogue $catalogue): static
    {
        $this->catalogue = $catalogue;
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
            $media->setExposition($this);
        }

        return $this;
    }

    public function removeMedia(Medias $media): static
    {
        if ($this->medias->removeElement($media)) {
            // set the owning side to null (unless already changed)
            if ($media->getExposition() === $this) {
                $media->setExposition(null);
            }
        }

        return $this;
    }

    public function getVisiteVirtuelleUrl(): ?string
    {
        return $this->visite_virtuelle_url;
    }

    public function setVisiteVirtuelleUrl(?string $visite_virtuelle_url): static
    {
        $this->visite_virtuelle_url = $visite_virtuelle_url;

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
            $oeuvre->setExposition($this);
        }

        return $this;
    }

    public function removeOeuvre(Oeuvre $oeuvre): static
    {
        if ($this->oeuvres->removeElement($oeuvre)) {
            // set the owning side to null (unless already changed)
            if ($oeuvre->getExposition() === $this) {
                $oeuvre->setExposition(null);
            }
        }

        return $this;
    }


    
}
