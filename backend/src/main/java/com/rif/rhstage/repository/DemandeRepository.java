package com.rif.rhstage.repository;

import com.rif.rhstage.entity.Demande;
import com.rif.rhstage.entity.StatutDemande;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DemandeRepository extends JpaRepository<Demande, UUID> {

    List<Demande> findByCandidatId(UUID candidatId);

    List<Demande> findByOffreStageId(UUID offreStageId);

    List<Demande> findByRhTraitantId(UUID rhTraitantId);

    List<Demande> findByStatut(StatutDemande statut);

    boolean existsByCandidatIdAndOffreStageId(UUID candidatId, UUID offreStageId);
}

