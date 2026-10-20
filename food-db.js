// Local everyday-food catalog for Food Tracker.
// Values are practical estimates and remain editable in the UI.
// Most gram-based entries use a 100 g cooked/ready-to-eat reference unless noted.
(() => {
  const D = {};
  const add=(names,serv,cal,p,c,f)=>{
    const base={serv,cal,p,c,f};
    names.forEach(n=>D[n]=base);
  };

  // Eggs, meat, poultry, seafood
  add(['egg','eggs'],'1 large egg',72,6.3,.4,4.8);
  add(['egg white','egg whites'],'1 large',17,3.6,.2,.1);
  add(['chicken breast','grilled chicken breast'],'100g cooked',165,31,0,3.6);
  add(['chicken thigh','chicken thighs'],'100g cooked',209,26,0,10.9);
  add(['chicken wing','chicken wings'],'100g cooked',203,30.5,0,8.1);
  add(['rotisserie chicken'],'100g',190,28,0,8);
  add(['ground chicken'],'100g cooked',189,23,0,10);
  add(['turkey breast'],'100g cooked',135,29,0,1.8);
  add(['ground turkey'],'100g cooked',203,27,0,10);
  add(['ham'],'1 slice (~28g)',45,5,1,2);
  add(['turkey ham'],'1 slice (~28g)',35,5,1,1);
  add(['bacon'],'1 cooked slice',43,3,.1,3.3);
  add(['turkey bacon'],'1 cooked slice',30,2.5,.5,2);
  add(['pork chop','pork chops'],'100g cooked',231,25.7,0,14.7);
  add(['pork tenderloin'],'100g cooked',143,26,0,3.5);
  add(['ground pork'],'100g cooked',297,25.7,0,20.8);
  add(['steak','beef steak'],'100g cooked',250,26,0,17);
  add(['sirloin steak','sirloin'],'100g cooked',206,29,0,9);
  add(['ribeye steak','ribeye'],'100g cooked',291,24.9,0,21.8);
  add(['filet mignon','beef tenderloin'],'100g cooked',227,27,0,12);
  add(['ground beef'],'100g cooked',250,26,0,15);
  add(['lean ground beef'],'100g cooked',217,26,0,12);
  add(['beef brisket','brisket'],'100g cooked',246,28,0,14);
  add(['beef roast','roast beef'],'100g cooked',235,27,0,14);
  add(['beef jerky'],'28g',116,9,3,7);
  add(['lamb','lamb chop','lamb chops'],'100g cooked',258,25.6,0,16.5);
  add(['salmon'],'100g cooked',206,22,0,12);
  add(['smoked salmon'],'100g',117,18.3,0,4.3);
  add(['tuna'],'100g',132,29,0,1);
  add(['canned tuna'],'100g drained',116,25.5,0,1);
  add(['cod'],'100g cooked',105,23,0,1);
  add(['tilapia'],'100g cooked',128,26,0,2.7);
  add(['halibut'],'100g cooked',140,27,0,3);
  add(['shrimp','prawns'],'100g cooked',99,24,0,.3);
  add(['scallops'],'100g cooked',137,24,5,1);
  add(['crab'],'100g cooked',97,20,0,1.5);
  add(['lobster'],'100g cooked',89,19,0,.9);
  add(['sardines'],'100g',208,25,0,11.5);

  // Dairy, cheese, protein
  add(['greek yogurt','nonfat greek yogurt'],'170g',100,17,6,0);
  add(['whole greek yogurt'],'170g',170,16,7,9);
  add(['yogurt','plain yogurt'],'170g',120,10,9,4);
  add(['cottage cheese'],'100g',90,12,3,2.5);
  add(['milk','whole milk'],'1 cup (~244g)',149,7.7,11.7,7.9);
  add(['2% milk','two percent milk'],'1 cup (~244g)',122,8,12,4.8);
  add(['skim milk','nonfat milk'],'1 cup (~244g)',83,8.3,12.2,.2);
  add(['almond milk','unsweetened almond milk'],'1 cup (~240g)',30,1,1,2.5);
  add(['oat milk'],'1 cup (~240g)',120,3,16,5);
  add(['cheddar cheese','cheddar'],'28g',113,7,.4,9.3);
  add(['mozzarella','mozzarella cheese'],'28g',85,6.3,.7,6.3);
  add(['feta','feta cheese'],'28g',75,4,1.2,6);
  add(['goat cheese','goat cheeze'],'28g',103,6,0,8.5);
  add(['parmesan','parmesan cheese'],'28g',111,10,1,7.3);
  add(['swiss cheese'],'28g',111,7.6,.4,8.8);
  add(['cream cheese'],'1 tbsp (~14g)',50,.9,.8,5);
  add(['ricotta','ricotta cheese'],'100g',174,11,3,13);
  add(['protein shake','whey protein','protein powder'],'1 scoop',120,24,3,2);
  add(['collagen powder','collagen peptides'],'1 scoop (~10g)',36,9,0,0);

  // Grains, breads, starches
  add(['bread','white bread'],'1 slice',80,3,15,1);
  add(['whole wheat bread','wheat bread'],'1 slice',81,4,13.8,1.1);
  add(['sourdough','sourdough bread','sourdough slice','sourdough slices','sourdough toast'],'1 slice (~36g)',93,3.8,18.6,.7);
  add(['rye bread'],'1 slice',83,2.7,15.5,1.1);
  add(['pita','pita bread'],'1 medium pita',165,5.5,33.5,1);
  add(['tortilla','flour tortilla'],'1 medium',144,4,24,4);
  add(['corn tortilla'],'1 medium',52,1.4,10.7,.7);
  add(['bagel'],'1 medium (~100g)',270,10,53,2);
  add(['english muffin'],'1 muffin',134,4.4,26,1);
  add(['croissant'],'1 medium',231,4.7,26,12);
  add(['white rice','rice'],'100g cooked',130,2.7,28,.3);
  add(['brown rice'],'100g cooked',123,2.7,25.6,1);
  add(['jasmine rice'],'100g cooked',129,2.7,28,.2);
  add(['basmati rice'],'100g cooked',121,3.5,25.2,.4);
  add(['wild rice'],'100g cooked',101,4,21.3,.3);
  add(['quinoa'],'100g cooked',120,4.4,21.3,1.9);
  add(['couscous'],'100g cooked',112,3.8,23.2,.2);
  add(['bulgur'],'100g cooked',83,3.1,18.6,.2);
  add(['oatmeal','oats'],'40g dry',150,5,27,3);
  add(['granola'],'50g',235,5,32,10);
  add(['pasta','spaghetti','penne'],'100g cooked',157,5.8,30.9,.9);
  add(['whole wheat pasta'],'100g cooked',149,6,30,1.7);
  add(['macaroni'],'100g cooked',158,5.8,31,.9);
  add(['ramen noodles','ramen'],'1 cooked package',380,9,54,14);
  add(['soba noodles','soba'],'100g cooked',99,5.1,21.4,.1);
  add(['rice noodles'],'100g cooked',109,.9,24.9,.2);
  add(['potato','potatoes'],'1 medium (~173g)',161,4.3,36.6,.2);
  add(['sweet potato','sweet potatoes'],'1 medium (~130g)',112,2,26,.1);
  add(['mashed potatoes'],'100g',113,2,16.8,4.2);
  add(['french fries','fries'],'100g',312,3.4,41,15);
  add(['hash browns'],'100g',219,3,31,9);

  // Legumes, nuts, seeds
  add(['black beans'],'100g cooked',132,8.9,23.7,.5);
  add(['kidney beans'],'100g cooked',127,8.7,22.8,.5);
  add(['pinto beans'],'100g cooked',143,9,26,.7);
  add(['chickpeas','garbanzo beans'],'100g cooked',164,8.9,27.4,2.6);
  add(['lentils'],'100g cooked',116,9,20,.4);
  add(['edamame'],'100g cooked',121,11.9,8.9,5.2);
  add(['tofu'],'100g firm',144,17,2.8,8.7);
  add(['tempeh'],'100g',195,20,7.6,11);
  add(['hummus'],'2 tbsp (~30g)',70,2,6,5);
  add(['peanut butter'],'1 tbsp (~16g)',94,3.6,3.2,8);
  add(['almond butter'],'1 tbsp (~16g)',98,3.4,3,9);
  add(['almonds'],'28g',164,6,6,14);
  add(['walnuts'],'28g',185,4.3,3.9,18.5);
  add(['cashews'],'28g',157,5.2,8.6,12.4);
  add(['pistachios'],'28g',159,5.7,7.7,12.8);
  add(['peanuts'],'28g',161,7.3,4.6,14);
  add(['chia seeds'],'28g',138,4.7,12,8.7);
  add(['flax seeds','flaxseed'],'28g',150,5.1,8.1,11.8);
  add(['pumpkin seeds'],'28g',158,8.6,3,13.9);

  // Fruit
  add(['banana'],'1 medium',105,1.3,27,.4);
  add(['apple'],'1 medium',95,.5,25,.3);
  add(['orange'],'1 medium',62,1.2,15.4,.2);
  add(['pear'],'1 medium',101,.6,27,.3);
  add(['peach'],'1 medium',59,1.4,14,.4);
  add(['plum'],'1 medium',30,.5,7.5,.2);
  add(['nectarine'],'1 medium',63,1.5,15,.5);
  add(['mango'],'1 cup (~165g)',99,1.4,25,.6);
  add(['pineapple'],'1 cup (~165g)',82,.9,21.7,.2);
  add(['watermelon'],'1 cup (~152g)',46,.9,11.5,.2);
  add(['cantaloupe'],'1 cup (~156g)',53,1.3,12.7,.3);
  add(['grapes'],'1 cup (~151g)',104,1.1,27.3,.2);
  add(['strawberries'],'1 cup (~152g)',49,1,11.7,.5);
  add(['blueberries'],'1 cup (~148g)',84,1.1,21.4,.5);
  add(['raspberries'],'1 cup (~123g)',64,1.5,14.7,.8);
  add(['blackberries'],'1 cup (~144g)',62,2,13.8,.7);
  add(['kiwi','kiwifruit'],'1 medium',42,.8,10.1,.4);
  add(['avocado'],'1 medium',240,3,12.8,22);
  add(['dates'],'1 medjool date',66,.4,18,0);
  add(['raisins'],'28g',85,.9,22.5,.1);

  // Vegetables
  add(['lettuce'],'1 large leaf',2,.1,.4,0);
  add(['spinach'],'100g raw',23,2.9,3.6,.4);
  add(['kale'],'100g raw',35,2.9,4.4,1.5);
  add(['broccoli'],'100g cooked',35,2.4,7.2,.4);
  add(['cauliflower'],'100g cooked',23,1.8,4.1,.5);
  add(['brussels sprouts'],'100g cooked',36,2.6,7.1,.5);
  add(['asparagus'],'100g cooked',22,2.4,4.1,.2);
  add(['green beans'],'100g cooked',35,1.9,7.9,.3);
  add(['peas','green peas'],'100g cooked',84,5.4,15.6,.2);
  add(['corn','sweet corn'],'100g cooked',96,3.4,21,.5);
  add(['carrot','carrots'],'1 medium',25,.6,5.8,.1);
  add(['tomato','tomatoes'],'1 medium',22,1.1,4.8,.2);
  add(['cucumber'],'1 medium',30,1.3,7.3,.2);
  add(['bell pepper','red pepper','green pepper'],'1 medium',30,1,7,.3);
  add(['onion'],'1 medium',44,1.2,10.3,.1);
  add(['mushrooms','mushroom'],'100g cooked',28,3.6,5.3,.5);
  add(['zucchini'],'100g cooked',15,1.1,2.7,.4);
  add(['eggplant'],'100g cooked',35,.8,8.7,.2);
  add(['celery'],'1 medium stalk',6,.3,1.2,.1);
  add(['jalapeno','jalapeño'],'1 pepper',4,.1,.9,.1);

  // Fats, sauces, condiments, sweets
  add(['olive oil'],'1 tbsp',119,0,0,13.5);
  add(['avocado oil'],'1 tbsp',124,0,0,14);
  add(['coconut oil'],'1 tbsp',121,0,0,13.5);
  add(['butter'],'1 tbsp',102,.1,0,11.5);
  add(['mayonnaise','mayo'],'1 tbsp',94,.1,.1,10);
  add(['ketchup'],'1 tbsp',17,.2,4.5,.1);
  add(['mustard'],'1 tbsp',10,.6,.9,.6);
  add(['soy sauce'],'1 tbsp',9,1.3,.8,.1);
  add(['hot sauce'],'1 tbsp',3,.1,.6,0);
  add(['salsa'],'2 tbsp (~30g)',10,.5,2,.1);
  add(['ranch dressing','ranch'],'2 tbsp',129,.4,1.8,13.4);
  add(['caesar dressing'],'2 tbsp',158,.7,1.2,17);
  add(['balsamic vinaigrette'],'2 tbsp',90,.2,5,8);
  add(['guacamole'],'2 tbsp (~30g)',45,.6,2.4,4);
  add(['jam','jelly'],'1 tbsp (~20g)',50,0,13,0);
  add(['honey'],'1 tbsp',64,.1,17.3,0);
  add(['maple syrup'],'1 tbsp',52,0,13.4,0);
  add(['sugar'],'1 tsp',16,0,4.2,0);
  add(['dark chocolate'],'28g',170,2,13,12);
  add(['milk chocolate'],'28g',150,2.2,17,9);
  add(['ice cream'],'1/2 cup',137,2.3,16,7.3);

  // Common prepared foods
  add(['pizza','cheese pizza'],'1 slice',285,12,36,10);
  add(['pepperoni pizza'],'1 slice',313,13,35,13);
  add(['cheeseburger','burger'],'1 medium',303,17,30,14);
  add(['hamburger'],'1 medium',250,13,31,9);
  add(['hot dog'],'1 hot dog with bun',290,10,24,17);
  add(['chicken nuggets'],'6 pieces',250,14,15,15);
  add(['fried chicken'],'100g',246,30,9,12);
  add(['grilled cheese'],'1 sandwich',380,15,33,21);
  add(['peanut butter jelly sandwich','pbj'],'1 sandwich',390,13,54,16);
  add(['burrito'],'1 medium',450,20,55,17);
  add(['taco'],'1 taco',170,9,13,9);
  add(['quesadilla'],'1 medium',470,20,37,27);
  add(['sushi roll'],'1 roll',300,10,45,8);
  add(['california roll'],'1 roll',255,9,38,7);
  add(['salmon avocado roll'],'1 roll',304,13,42,9);
  add(['poke bowl'],'1 bowl',550,30,70,18);
  add(['chicken salad'],'1 cup',320,27,8,20);
  add(['caesar salad'],'1 entree',470,18,24,34);
  add(['oatmeal bowl'],'1 bowl',250,8,45,5);
  add(['pancake','pancakes'],'1 medium',86,2.4,11,3.7);
  add(['waffle','waffles'],'1 round',218,5.9,25,11);
  add(['french toast'],'1 slice',149,5,16,7);
  add(['scrambled eggs'],'2 eggs',180,13,2,13);
  add(['omelet','omelette'],'2-egg plain',190,14,2,14);

  const A = {
    'spurdpugh':'sourdough','spurdough':'sourdough','sour dough':'sourdough','sourdoh':'sourdough',
    'chicken':'chicken breast','grilled chicken':'chicken breast','turkey':'turkey breast',
    'beef':'steak','ground meat':'ground beef','yoghurt':'yogurt','greek yoghurt':'greek yogurt',
    'cottage cheeses':'cottage cheese','goat cheeses':'goat cheese',
    'brown bread':'whole wheat bread','toast':'bread','white toast':'white bread',
    'sweet potatoes':'sweet potato','potatoes':'potato','fries':'french fries',
    'black bean':'black beans','chickpea':'chickpeas','lentil':'lentils',
    'strawberry':'strawberries','blueberry':'blueberries','raspberry':'raspberries','blackberry':'blackberries',
    'vegetable oil':'olive oil','protein':'protein shake'
  };

  window.FOOD_DB = D;
  window.FOOD_ALIASES = A;
})();
