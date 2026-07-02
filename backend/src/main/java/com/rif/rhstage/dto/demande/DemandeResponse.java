package com.rif.rhstage.dto.demande;

import com.rif.rhstage.entity.StatutDemande;

import java.time.LocalDateTime;
import java.util.UUID;

public record DemandeResponse(
        UUID id,
        String referenceDemande,
        LocalDateTime dateDemande,

        String lettreMotivationUrl,
        String cvUrl,

        StatutDemande statut,
        Double noteTestTechnique,
        String commentaireRh,
        LocalDateTime updatedAt,

        UUID candidatId,
        String candidatNom,
        String candidatPrenom,
        String candidatEmail,
        String candidatSpecialite,
        String candidatNiveauEtude,

        UUID offreStageId,
        String referenceOffre,
        String offreTitre,
        String offreDomaine,

        UUID rhTraitantId,
        String rhTraitantNom
) {
}

