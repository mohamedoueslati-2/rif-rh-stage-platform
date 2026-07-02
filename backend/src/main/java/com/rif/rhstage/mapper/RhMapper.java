package com.rif.rhstage.mapper;

import com.rif.rhstage.dto.rh.CreateRhRequest;
import com.rif.rhstage.dto.rh.RhResponse;
import com.rif.rhstage.entity.RH;
import org.springframework.stereotype.Component;

@Component
public class RhMapper {

    public RH toEntity(CreateRhRequest request, String motDePasseHash) {
        RH rh = new RH();

        rh.setNom(request.nom());
        rh.setPrenom(request.prenom());
        rh.setEmail(request.email());
        rh.setMotDePasseHash(motDePasseHash);

        rh.setNomAffichage(request.nomAffichage());
        rh.setContactProfessionnel(request.contactProfessionnel());

        return rh;
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

