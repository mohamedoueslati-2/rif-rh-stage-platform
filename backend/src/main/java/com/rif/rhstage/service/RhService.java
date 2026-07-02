package com.rif.rhstage.service;

import com.rif.rhstage.dto.rh.PatchRhRequest;
import com.rif.rhstage.dto.rh.RhResponse;
import com.rif.rhstage.dto.rh.UpdateRhRequest;

import java.util.UUID;

public interface RhService {

    RhResponse getProfil(UUID rhId);

    RhResponse updateProfil(UUID rhId, UpdateRhRequest request);

    RhResponse patchProfil(UUID rhId, PatchRhRequest request);
}