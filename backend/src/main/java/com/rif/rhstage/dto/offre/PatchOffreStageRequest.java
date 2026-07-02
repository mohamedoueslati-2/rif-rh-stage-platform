package com.rif.rhstage.dto.offre;

import java.time.LocalDate;

public record PatchOffreStageRequest(
        String referenceOffre,
        String titre,
        String description,
        String domaine,
        String lieu,
        String duree,
        LocalDate dateDebut,
        LocalDate dateExpiration
) {
}

