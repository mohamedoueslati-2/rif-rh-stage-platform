package com.rif.rhstage.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "offres_stage")
public class OffreStage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 50)
    private String referenceOffre;

    @Column(nullable = false)
    private String titre;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    private String domaine;

    private String lieu;

    private String duree;

    private LocalDate dateDebut;

    private LocalDate dateExpiration;

    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rh_createur_id", nullable = false)
    private RH rhCreateur;

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}

