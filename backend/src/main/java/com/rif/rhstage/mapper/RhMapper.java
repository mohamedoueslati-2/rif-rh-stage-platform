package com.rif.rhstage.mapper;

import com.rif.rhstage.dto.rh.PatchRhRequest;
import com.rif.rhstage.dto.rh.RhResponse;
import com.rif.rhstage.dto.rh.UpdateRhRequest;
import com.rif.rhstage.entity.RH;
import org.springframework.stereotype.Component;

@Component
public class RhMapper {



    public void updateEntity(RH rh, UpdateRhRequest request) {
        rh.setNom(request.nom());
        rh.setPrenom(request.prenom());
        rh.setEmail(request.email());
        rh.setNomAffichage(request.nomAffichage());
        rh.setContactProfessionnel(request.contactProfessionnel());
    }

    public void patchEntity(RH rh, PatchRhRequest request) {
        if (request.nom() != null) {
            rh.setNom(request.nom());
        }

        if (request.prenom() != null) {
            rh.setPrenom(request.prenom());
        }

        if (request.email() != null) {
            rh.setEmail(request.email());
        }

        if (request.nomAffichage() != null) {
            rh.setNomAffichage(request.nomAffichage());
        }

        if (request.contactProfessionnel() != null) {
            rh.setContactProfessionnel(request.contactProfessionnel());
        }
    }

    public RhResponse toResponse(RH rh) {
        return new RhResponse(
                rh.getId(),
                rh.getNom(),
                rh.getPrenom(),
                rh.getEmail(),
                rh.getNomAffichage(),
                rh.getContactProfessionnel(),
                rh.getCreatedAt()
        );
    }
}