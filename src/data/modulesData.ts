import { Module } from '../types';
import { MODULE_1 } from './modules/module1_fundamenty';
import { MODULE_2 } from './modules/module2_html';
import { MODULE_3 } from './modules/module3_css';
import { MODULE_4 } from './modules/module4_javascript';
import { MODULE_5 } from './modules/module5_git';
import { MODULE_6 } from './modules/module6_typescript';
import { MODULE_7 } from './modules/module7_react';
import { MODULE_8 } from './modules/module8_backend';
import { MODULE_9 } from './modules/module9_databases';
import { MODULE_10 } from './modules/module10_security';
import { MODULES_11_TO_15 } from './modules/modulesRemaining';

export const MODULES_DATA: Module[] = [
  MODULE_1,
  MODULE_2,
  MODULE_3,
  MODULE_4,
  MODULE_5,
  MODULE_6,
  MODULE_7,
  MODULE_8,
  MODULE_9,
  MODULE_10,
  ...MODULES_11_TO_15,
];
