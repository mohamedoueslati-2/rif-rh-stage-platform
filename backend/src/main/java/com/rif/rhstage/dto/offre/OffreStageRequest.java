package com.rif.rhstage.dto.offre;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record OffreStageRequest(

        @NotBlank
        String referenceOffre,

        @NotBlank
        String titre,

        @NotBlank
        String description,

        @NotBlank
        String domaine,

        @NotBlank
        String lieu,

        @NotBlank
        String duree,

        @NotNull
        LocalDate dateDebut,

        @NotNull
        LocalDate dateExpiration,

        @NotNull
        UUID rhCreateurId
) {
}

