package com.rif.rhstage.dto.demande;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record UpdateNoteTestRequest(

        @NotNull
        @DecimalMin("0.0")
        @DecimalMax("100.0")
        Double noteTestTechnique
) {
}

