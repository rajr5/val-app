import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "split"
})
export class SplitPipe implements PipeTransform {
  transform(val: string): string[] {
    if (val && val.split) {
      return val.split("\n");
    } else {
      return [];
    }
  }
}
