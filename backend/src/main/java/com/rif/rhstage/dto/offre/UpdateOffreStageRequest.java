package com.rif.rhstage.dto.offre;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record UpdateOffreStageRequest(

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
        @FutureOrPresent
        LocalDate dateDebut,

        @NotNull
        @FutureOrPresent
        LocalDate dateExpiration
) {
}

