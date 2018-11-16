import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { createCategoryView } from '../../../../../models/category-view/category-view.model';
import { Category } from '../../../../../models/category/category.model';
import { categoryTree } from '../../../../../utils/dev/test-data-utils';
import { MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH } from '../../../../configurations/injection-keys';
import { IconModule } from '../../../../icon.module';

import { SubCategoryNavigationComponent } from './sub-category-navigation.component';

describe('Sub Category Navigation Component', () => {
  let fixture: ComponentFixture<SubCategoryNavigationComponent>;
  let component: SubCategoryNavigationComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IconModule, RouterTestingModule],
      declarations: [SubCategoryNavigationComponent],
      providers: [{ provide: MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH, useValue: 2 }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCategoryNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const tree = categoryTree([
      { uniqueId: 'A', name: 'CAT_A', categoryPath: ['A'] },
      { uniqueId: 'A.1', name: 'CAT_A1', categoryPath: ['A', 'A.1'] },
      { uniqueId: 'A.2', name: 'CAT_A2', categoryPath: ['A', 'A.2'] },
      { uniqueId: 'A.1.a', name: 'CAT_A1a', categoryPath: ['A', 'A.1', 'A.1.a'] },
      { uniqueId: 'A.1.a.alpha', name: 'CAT_A1aAlpha', categoryPath: ['A', 'A.1', 'A.1.a', 'A.1.a.alpha'] },
    ] as Category[]);

    component.category = createCategoryView(tree, 'A');
    component.subCategoriesDepth = 1;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
