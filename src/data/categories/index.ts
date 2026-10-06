import moviesData from './movies.json';
import seriesData from './series.json';
import activitiesData from './activities.json';
import objectsData from './objects.json';
import animalsData from './animals.json';
import videogamesData from './videogames.json';
import sportsData from './sports.json';
import famousPeopleData from './famous_people.json';
import foodData from './food.json';
import countriesData from './countries.json';
import professionsData from './professions.json';

import { Category, RawCategoryFile } from '../../types/game';

function mapRawCategory(raw: RawCategoryFile): Category {
  return {
    ...raw,
    words: raw.words.map(w => ({
      ...w,
      category: raw.name
    }))
  };
}

export const builtInCategories: Category[] = [
  mapRawCategory(moviesData as RawCategoryFile),
  mapRawCategory(seriesData as RawCategoryFile),
  mapRawCategory(activitiesData as RawCategoryFile),
  mapRawCategory(objectsData as RawCategoryFile),
  mapRawCategory(animalsData as RawCategoryFile),
  mapRawCategory(videogamesData as RawCategoryFile),
  mapRawCategory(sportsData as RawCategoryFile),
  mapRawCategory(famousPeopleData as RawCategoryFile),
  mapRawCategory(foodData as RawCategoryFile),
  mapRawCategory(countriesData as RawCategoryFile),
  mapRawCategory(professionsData as RawCategoryFile),
];
