import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Hero, Publisher } from '../../interfaces/hero';
import { HeroesService } from '../../services/heroes.service';
import { filter, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  public heroFrom = new FormGroup({
    id:               new FormControl<string>(''),
    superhero:        new FormControl<string>('', { nonNullable: true }),
    publisher:        new FormControl<Publisher>( Publisher.DCComics ),
    alter_ego:        new FormControl<string>(''),
    first_appearance: new FormControl<string>(''),
    characters:       new FormControl<string>(''),
    alt_img:          new FormControl<string>(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics'},
    { id: 'Marvel Comics', desc: 'Marvel - Comics'},
  ];

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {

    if( !this.router.url.includes('edit') ) return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroesService.getHeroById( id ) ),
      ).subscribe( hero => {

        if( !hero ) return this.router.navigateByUrl('/');

        this.heroFrom.reset(hero);
        return;
      });

  }

  get currentHero(): Hero {
    const hero = this.heroFrom.value as Hero;

    return hero;
  }

  onSubmit():void {

    if(this.heroFrom.invalid) return;

    //this.heroesService.updateHero( );
    if( this.currentHero.id ) {
      this.heroesService.updateHero( this.currentHero )
        .subscribe( hero => {
          //TODO: Mostrar snackbar
          this.showSnackBar(hero.superhero+" actualizado");
        });

        return;
    }

    this.heroesService.addHero( this.currentHero )
      .subscribe( hero => {
        //TODO: Mostrar snackbar y navegar a /heroes/edit/ hero.id
        this.router.navigate(['/heroes/edit', hero.id]);
        this.showSnackBar(hero.superhero+" creado");
      });

  }

  onDeleteHero():void {
    if( !this.currentHero.id ) {
      throw Error('Hero id is required');
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroFrom.value,
    });

    dialogRef.afterClosed()
      .pipe(
        filter( (result:boolean) => result ),
        switchMap( (result) => this.heroesService.deleteHeroById(this.currentHero.id)),
        filter( (wasDeleted:boolean) => wasDeleted ),
      )
      .subscribe(result => {
        this.router.navigate(['/heroes']);
      });

    /*
    dialogRef.afterClosed().subscribe(result => {

      if(!result)  return;

      this.heroesService.deleteHeroById(this.currentHero.id)
        .subscribe( wasDeleted => {
          if(wasDeleted)
            this.router.navigate(['/heroes']);
        });
    });
    */
  }

  showSnackBar( message: string ):void {
    this.snackBar.open( message, 'done', {
      duration: 2500
    });

  }
}
