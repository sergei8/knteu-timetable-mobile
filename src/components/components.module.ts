import { NgModule } from '@angular/core';
import { NewsComponent } from './news/news';
import { NewsDetailsComponent } from './news-details/news-details';
@NgModule({
	declarations: [NewsComponent,
    NewsDetailsComponent],
	imports: [],
	exports: [NewsComponent,
    NewsDetailsComponent]
})
export class ComponentsModule {}
