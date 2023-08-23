function parallelTraverse( a, b, callback ) {

	callback( a, b );

	for ( var i = 0; i < a.children.length; i ++ ) {

		parallelTraverse( a.children[ i ], b.children[ i ], callback );

	}

}

function cloneFbx ( source ) 
{

    var cloneLookup = new Map();

    var clone = source.clone();

    parallelTraverse( source, clone, function ( sourceNode, clonedNode ) {

        cloneLookup.set( sourceNode, clonedNode );

    } );

    source.traverse( function ( sourceMesh ) {

        if ( ! sourceMesh.isSkinnedMesh ) return;

        var sourceBones = sourceMesh.skeleton.bones;
        var clonedMesh = cloneLookup.get( sourceMesh );

        clonedMesh.skeleton = sourceMesh.skeleton.clone();

        clonedMesh.skeleton.bones = sourceBones.map( function ( sourceBone ) {

            if ( ! cloneLookup.has( sourceBone ) ) {

                throw new Error( 'Required bones are not descendants of the given object.' );

            }

            return cloneLookup.get( sourceBone );

        } );

        clonedMesh.bind( clonedMesh.skeleton, sourceMesh.bindMatrix );

    } );

    if(source.animations)
        clone.animations = source.animations;
        
    return clone;

}
