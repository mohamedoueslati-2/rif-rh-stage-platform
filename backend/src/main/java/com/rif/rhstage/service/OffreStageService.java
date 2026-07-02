package com.rif.rhstage.service;

import com.rif.rhstage.dto.offre.OffreStageRequest;
import com.rif.rhstage.dto.offre.OffreStageResponse;
import com.rif.rhstage.dto.offre.PatchOffreStageRequest;
import com.rif.rhstage.dto.offre.UpdateOffreStageRequest;

import java.util.List;
import java.util.UUID;

public interface OffreStageService {

    OffreStageResponse create(UUID rhId, OffreStageRequest request);

    List<OffreStageResponse> getAll();

    OffreStageResponse getById(UUID id);

    OffreStageResponse update(UUID id, UUID rhId, UpdateOffreStageRequest request);

    OffreStageResponse patch(UUID id, UUID rhId, PatchOffreStageRequest request);

    void delete(UUID id, UUID rhId);
}

