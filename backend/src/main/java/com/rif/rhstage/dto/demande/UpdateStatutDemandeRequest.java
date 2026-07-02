package com.rif.rhstage.dto.demande;

import com.rif.rhstage.entity.StatutDemande;
import jakarta.validation.constraints.NotNull;

public record UpdateStatutDemandeRequest(

        @NotNull
        StatutDemande statut
) {
}

