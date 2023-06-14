/// <reference types="astro/client" />
namespace App {
    interface Locals {
       register: (key: string, fn: () => Promise<any>) => Promise<string>
    }
}