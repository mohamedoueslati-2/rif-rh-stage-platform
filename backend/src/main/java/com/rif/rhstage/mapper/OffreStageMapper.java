package com.rif.rhstage.mapper;

import com.rif.rhstage.dto.offre.OffreStageRequest;
import com.rif.rhstage.dto.offre.OffreStageResponse;
import com.rif.rhstage.entity.OffreStage;
import com.rif.rhstage.entity.RH;
import org.springframework.stereotype.Component;

@Component
public class OffreStageMapper {

    public OffreStage toEntity(OffreStageRequest request, RH rhCreateur) {
        OffreStage offreStage = new OffreStage();

        offreStage.setReferenceOffre(request.referenceOffre());
        offreStage.setTitre(request.titre());
        offreStage.setDescription(request.description());
        offreStage.setDomaine(request.domaine());
        offreStage.setLieu(request.lieu());
        offreStage.setDuree(request.duree());
        offreStage.setDateDebut(request.dateDebut());
        offreStage.setDateExpiration(request.dateExpiration());
        offreStage.setRhCreateur(rhCreateur);

        return offreStage;
    }

    public OffreStageResponse toResponse(OffreStage offreStage) {
        RH rhCreateur = offreStage.getRhCreateur();

        return new OffreStageResponse(
                offreStage.getId(),
                offreStage.getReferenceOffre(),
                offreStage.getTitre(),
                offreStage.getDescription(),
                offreStage.getDomaine(),
                offreStage.getLieu(),
                offreStage.getDuree(),
                offreStage.getDateDebut(),
                offreStage.getDateExpiration(),
                offreStage.getCreatedAt(),

                rhCreateur.getId(),
                rhCreateur.getNom() + " " + rhCreateur.getPrenom(),
                rhCreateur.getEmail()
        );
    }
}

