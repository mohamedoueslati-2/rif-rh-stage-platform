package com.rif.rhstage.mapper;

import com.rif.rhstage.dto.candidat.CandidatResponse;
import com.rif.rhstage.dto.candidat.PatchCandidatRequest;
import com.rif.rhstage.dto.candidat.CreateCandidatRequest;
import com.rif.rhstage.dto.candidat.UpdateCandidatRequest;
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

    public void updateEntity(Candidat candidat, UpdateCandidatRequest request) {
        candidat.setNom(request.nom());
        candidat.setPrenom(request.prenom());
        candidat.setEmail(request.email());
        candidat.setTelephone(request.telephone());
        candidat.setSpecialite(request.specialite());
        candidat.setNiveauEtude(request.niveauEtude());
    }

    public void patchEntity(Candidat candidat, PatchCandidatRequest request) {
        if (request.nom() != null) {
            candidat.setNom(request.nom());
        }

        if (request.prenom() != null) {
            candidat.setPrenom(request.prenom());
        }

        if (request.email() != null) {
            candidat.setEmail(request.email());
        }

        if (request.telephone() != null) {
            candidat.setTelephone(request.telephone());
        }

        if (request.specialite() != null) {
            candidat.setSpecialite(request.specialite());
        }

        if (request.niveauEtude() != null) {
            candidat.setNiveauEtude(request.niveauEtude());
        }
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

