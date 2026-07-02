package com.rif.rhstage.service;

import com.rif.rhstage.dto.rh.CreateRhRequest;
import com.rif.rhstage.dto.rh.RhResponse;

import java.util.List;
import java.util.UUID;

public interface RhService {

    RhResponse create(CreateRhRequest request);

    List<RhResponse> getAll();

    RhResponse getById(UUID id);
}

