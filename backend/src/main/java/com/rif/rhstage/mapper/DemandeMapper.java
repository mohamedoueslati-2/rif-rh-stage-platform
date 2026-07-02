package com.rif.rhstage.mapper;

import com.rif.rhstage.dto.demande.DemandeRequest;
import com.rif.rhstage.dto.demande.DemandeResponse;
import com.rif.rhstage.entity.Candidat;
import com.rif.rhstage.entity.Demande;
import com.rif.rhstage.entity.OffreStage;
import com.rif.rhstage.entity.RH;
import org.springframework.stereotype.Component;

@Component
public class DemandeMapper {

    public Demande toEntity(
            DemandeRequest request,
            Candidat candidat,
            OffreStage offreStage,
            String referenceDemande
    ) {
        Demande demande = new Demande();

        demande.setReferenceDemande(referenceDemande);
        demande.setCandidat(candidat);
        demande.setOffreStage(offreStage);
        demande.setCvUrl(request.cvUrl());
        demande.setLettreMotivationUrl(request.lettreMotivationUrl());

        return demande;
    }

    public DemandeResponse toResponse(Demande demande) {
        Candidat candidat = demande.getCandidat();
        OffreStage offreStage = demande.getOffreStage();
        RH rhTraitant = demande.getRhTraitant();

        return new DemandeResponse(
                demande.getId(),
                demande.getReferenceDemande(),
                demande.getDateDemande(),

                demande.getLettreMotivationUrl(),
                demande.getCvUrl(),

                demande.getStatut(),
                demande.getNoteTestTechnique(),
                demande.getCommentaireRh(),
                demande.getUpdatedAt(),

                candidat.getId(),
                candidat.getNom(),
                candidat.getPrenom(),
                candidat.getEmail(),
                candidat.getSpecialite(),
                candidat.getNiveauEtude(),

                offreStage.getId(),
                offreStage.getReferenceOffre(),
                offreStage.getTitre(),
                offreStage.getDomaine(),

                rhTraitant != null ? rhTraitant.getId() : null,
                rhTraitant != null ? rhTraitant.getNom() + " " + rhTraitant.getPrenom() : null
        );
    }
}

