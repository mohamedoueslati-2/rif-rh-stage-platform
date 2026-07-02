package com.rif.rhstage.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "demandes")
public class Demande {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateDemande;

    @Column(length = 500)
    private String lettreMotivationUrl;

    @Column(nullable = false, length = 500)
    private String cvUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private StatutDemande statut;

    private Double noteTestTechnique;

    @Column(columnDefinition = "TEXT")
    private String commentaireRh;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidat_id", nullable = false)
    private Candidat candidat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offre_stage_id", nullable = false)
    private OffreStage offreStage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rh_traitant_id")
    private RH rhTraitant;

    @PrePersist
    protected void onCreate() {
        this.dateDemande = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();

        if (this.statut == null) {
            this.statut = StatutDemande.SOUMISE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

