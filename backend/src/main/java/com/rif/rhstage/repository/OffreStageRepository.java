package com.rif.rhstage.repository;

import com.rif.rhstage.entity.OffreStage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface OffreStageRepository extends JpaRepository<OffreStage, UUID> {

    List<OffreStage> findByRhCreateurId(UUID rhCreateurId);

    List<OffreStage> findByDateExpirationGreaterThanEqual(LocalDate today);
}

