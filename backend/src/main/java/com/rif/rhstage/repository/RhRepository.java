package com.rif.rhstage.repository;

import com.rif.rhstage.entity.RH;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RhRepository extends JpaRepository<RH, UUID> {

    Optional<RH> findByEmail(String email);
}

