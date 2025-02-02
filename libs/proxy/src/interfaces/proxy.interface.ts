import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import * as server from 'http-proxy';

export interface Service {
  id: string;
  url: string;
  config?: server.ServerOptions;
}

export interface ProxyModuleOptions {
  config?: server.ServerOptions;
  services?: Service[];
}

export interface ProxyModuleOptionsFactory {
  createModuleConfig(): Promise<ProxyModuleOptions> | ProxyModuleOptions;
}

export interface ProxyModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<ProxyModuleOptionsFactory>;
  useClass?: Type<ProxyModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<ProxyModuleOptions> | ProxyModuleOptions;
  inject?: any[];
}
