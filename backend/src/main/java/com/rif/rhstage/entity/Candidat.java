package com.rif.rhstage.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "candidats")
public class Candidat extends Personne {

    @Column(length = 30)
    private String telephone;

    @Column(length = 120)
    private String specialite;

    @Column(length = 120)
    private String niveauEtude;
}

