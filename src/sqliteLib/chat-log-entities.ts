/**
 * TypeORM entities for logging AI Interactions
 */

// NPM Imports
import "reflect-metadata";
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  BaseEntity, Point, BeforeInsert, AfterInsert, RelationOptions, AfterLoad,

  OneToMany, ManyToOne, JoinColumn, JoinTable, OneToOne, type Relation,
} from "typeorm";

import { IsIn, IsOptional, IsDate, validate, } from 'class-validator';
import _ from 'lodash';

// PK-LIB Imports

import { GenObj, isEmpty, typeOf, }
  from 'pk-ts-common-lib';

import { PkBaseEntity, PkBaseUser, } from "pk-ts-sqlite-lib/typeorm";

// Local Imports

// Implementation
let cascade: RelationOptions = { cascade: true, };

