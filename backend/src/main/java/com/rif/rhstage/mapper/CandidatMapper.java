package com.rif.rhstage.mapper;

import com.rif.rhstage.dto.candidat.CandidatResponse;
import com.rif.rhstage.dto.candidat.CreateCandidatRequest;
import com.rif.rhstage.entity.Candidat;
import org.springframework.stereotype.Component;

@Component
public class CandidatMapper {

    public Candidat toEntity(CreateCandidatRequest request, String motDePasseHash) {
        Candidat candidat = new Candidat();

        candidat.setNom(request.nom());
        candidat.setPrenom(request.prenom());
        candidat.setEmail(request.email());
        candidat.setMotDePasseHash(motDePasseHash);

        candidat.setTelephone(request.telephone());
        candidat.setSpecialite(request.specialite());
        candidat.setNiveauEtude(request.niveauEtude());

        return candidat;
    }

    public CandidatResponse toResponse(Candidat candidat) {
        return new CandidatResponse(
                candidat.getId(),
                candidat.getNom(),
                candidat.getPrenom(),
                candidat.getEmail(),
                candidat.getTelephone(),
                candidat.getSpecialite(),
                candidat.getNiveauEtude(),
                candidat.getCreatedAt()
        );
    }
}

