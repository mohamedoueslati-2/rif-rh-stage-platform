package com.rif.rhstage.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "rh")
public class RH extends Personne {

    @Column(length = 120)
    private String nomAffichage;

    @Column(length = 150)
    private String contactProfessionnel;
}

