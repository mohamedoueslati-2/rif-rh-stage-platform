package com.rif.rhstage.repository;

import com.rif.rhstage.entity.Demande;
import com.rif.rhstage.entity.StatutDemande;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DemandeRepository extends JpaRepository<Demande, UUID> {

    List<Demande> findByCandidatId(UUID candidatId);

    Optional<Demande> findByCandidatIdAndId(UUID candidatId, UUID id);

    List<Demande> findByOffreStageId(UUID offreStageId);

    List<Demande> findByRhTraitantId(UUID rhTraitantId);

    List<Demande> findByStatut(StatutDemande statut);

    boolean existsByCandidatId(UUID candidatId);

    boolean existsByCandidatIdAndOffreStageId(UUID candidatId, UUID offreStageId);

    boolean existsByReferenceDemande(String referenceDemande);

    boolean existsByOffreStageId(UUID offreStageId);
}

