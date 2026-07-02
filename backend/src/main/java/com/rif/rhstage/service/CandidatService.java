package com.rif.rhstage.service;

import com.rif.rhstage.dto.candidat.*;

import java.util.UUID;

public interface CandidatService {

    CandidatResponse register(CreateCandidatRequest request);

    CandidatResponse getProfil(UUID candidatId);

    CandidatResponse updateProfil(UUID candidatId, UpdateCandidatRequest request);

    CandidatResponse patchProfil(UUID candidatId, PatchCandidatRequest request);

    void changePassword(UUID candidatId, ChangeCandidatPasswordRequest request);

    void deleteProfil(UUID candidatId);
}

