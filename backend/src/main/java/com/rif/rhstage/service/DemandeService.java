package com.rif.rhstage.service;

import com.rif.rhstage.dto.demande.DemandeRequest;
import com.rif.rhstage.dto.demande.DemandeResponse;
import com.rif.rhstage.dto.demande.UpdateCommentaireRhRequest;
import com.rif.rhstage.dto.demande.UpdateStatutDemandeRequest;

import java.util.List;
import java.util.UUID;

public interface DemandeService {

    DemandeResponse create(DemandeRequest request);

    List<DemandeResponse> getAll();

    DemandeResponse getById(UUID id);

    List<DemandeResponse> getByCandidatId(UUID candidatId);

    List<DemandeResponse> getByOffreStageId(UUID offreStageId);

    DemandeResponse updateStatut(UUID id, UpdateStatutDemandeRequest request);

    DemandeResponse updateCommentaire(UUID id, UpdateCommentaireRhRequest request);
}

