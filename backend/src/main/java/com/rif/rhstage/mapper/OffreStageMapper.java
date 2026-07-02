package com.rif.rhstage.mapper;

import com.rif.rhstage.dto.offre.OffreStageRequest;
import com.rif.rhstage.dto.offre.OffreStageResponse;
import com.rif.rhstage.dto.offre.PatchOffreStageRequest;
import com.rif.rhstage.dto.offre.UpdateOffreStageRequest;
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

    public void updateEntity(OffreStage offreStage, UpdateOffreStageRequest request) {
        offreStage.setReferenceOffre(request.referenceOffre());
        offreStage.setTitre(request.titre());
        offreStage.setDescription(request.description());
        offreStage.setDomaine(request.domaine());
        offreStage.setLieu(request.lieu());
        offreStage.setDuree(request.duree());
        offreStage.setDateDebut(request.dateDebut());
        offreStage.setDateExpiration(request.dateExpiration());
    }

    public void patchEntity(OffreStage offreStage, PatchOffreStageRequest request) {
        if (request.referenceOffre() != null) {
            offreStage.setReferenceOffre(request.referenceOffre());
        }

        if (request.titre() != null) {
            offreStage.setTitre(request.titre());
        }

        if (request.description() != null) {
            offreStage.setDescription(request.description());
        }

        if (request.domaine() != null) {
            offreStage.setDomaine(request.domaine());
        }

        if (request.lieu() != null) {
            offreStage.setLieu(request.lieu());
        }

        if (request.duree() != null) {
            offreStage.setDuree(request.duree());
        }

        if (request.dateDebut() != null) {
            offreStage.setDateDebut(request.dateDebut());
        }

        if (request.dateExpiration() != null) {
            offreStage.setDateExpiration(request.dateExpiration());
        }
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

