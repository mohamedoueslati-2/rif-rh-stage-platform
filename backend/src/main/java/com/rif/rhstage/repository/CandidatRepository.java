package com.rif.rhstage.repository;

import com.rif.rhstage.entity.Candidat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CandidatRepository extends JpaRepository<Candidat, UUID> {

    Optional<Candidat> findByEmail(String email);
}

