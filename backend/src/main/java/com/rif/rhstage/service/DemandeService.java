package com.rif.rhstage.service;

import com.rif.rhstage.dto.demande.DemandeRequest;
import com.rif.rhstage.dto.demande.DemandeResponse;
import com.rif.rhstage.dto.demande.UpdateCommentaireRhRequest;
import com.rif.rhstage.dto.demande.UpdateNoteTestRequest;
import com.rif.rhstage.dto.demande.UpdateStatutDemandeRequest;

import java.util.List;
import java.util.UUID;

public interface DemandeService {

    DemandeResponse create(UUID candidatId, UUID offreId, DemandeRequest request);

    List<DemandeResponse> getMyDemandes(UUID candidatId);

    DemandeResponse getMyDemandeById(UUID candidatId, UUID id);

    List<DemandeResponse> getAll();

    DemandeResponse getById(UUID id);

    DemandeResponse updateStatut(UUID id, UUID rhId, UpdateStatutDemandeRequest request);

    DemandeResponse updateCommentaire(UUID id, UUID rhId, UpdateCommentaireRhRequest request);

    DemandeResponse updateNoteTest(UUID id, UUID rhId, UpdateNoteTestRequest request);

    void delete(UUID id, UUID candidatId);
}

