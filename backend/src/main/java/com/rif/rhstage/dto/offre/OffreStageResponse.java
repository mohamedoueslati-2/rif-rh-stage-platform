package com.rif.rhstage.dto.offre;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record OffreStageResponse(
        UUID id,
        String referenceOffre,
        String titre,
        String description,
        String domaine,
        String lieu,
        String duree,
        LocalDate dateDebut,
        LocalDate dateExpiration,
        LocalDateTime createdAt,

        UUID rhCreateurId,
        String rhCreateurNom,
        String rhCreateurEmail
) {
}

