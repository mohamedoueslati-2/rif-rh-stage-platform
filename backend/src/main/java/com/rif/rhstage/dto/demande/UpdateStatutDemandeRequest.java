package com.rif.rhstage.dto.demande;

import com.rif.rhstage.entity.StatutDemande;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record UpdateStatutDemandeRequest(

        @NotNull
        StatutDemande statut,

        UUID rhTraitantId
) {
}

