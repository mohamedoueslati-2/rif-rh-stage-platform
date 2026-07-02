package com.rif.rhstage.service;

import com.rif.rhstage.dto.offre.OffreStageRequest;
import com.rif.rhstage.dto.offre.OffreStageResponse;

import java.util.List;
import java.util.UUID;

public interface OffreStageService {

    OffreStageResponse create(OffreStageRequest request);

    List<OffreStageResponse> getAll();

    List<OffreStageResponse> getOffresDisponibles();

    List<OffreStageResponse> getByRhCreateurId(UUID rhCreateurId);

    OffreStageResponse getById(UUID id);

    void delete(UUID id);
}

