package com.rif.rhstage.service;

import com.rif.rhstage.dto.candidat.CandidatResponse;
import com.rif.rhstage.dto.candidat.CreateCandidatRequest;

import java.util.List;
import java.util.UUID;

public interface CandidatService {

    CandidatResponse create(CreateCandidatRequest request);

    List<CandidatResponse> getAll();

    CandidatResponse getById(UUID id);
}

